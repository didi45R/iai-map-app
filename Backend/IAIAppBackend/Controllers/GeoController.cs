using IAIAppBackend.Models;
using IAIAppBackend.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using Newtonsoft.Json.Linq;

namespace IAIAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeoController : ControllerBase
    {

        private readonly IMongoCollection<GeoData> _collection;

        public GeoController(IMongoService mongoService)
        {
            _collection = mongoService.Collection;
        }

        /// <summary>
        /// Method to convert GeoData to DTO for response to Frontend
        /// </summary>
        /// <param name="geo">GeoData</param>
        /// <returns>DTO of Polygon or Point</returns>
        private object GeoToDto(GeoData geo)
        {
            if (geo.Geometry.Type == GeoJsonObjectType.Point)
            {
                var point = geo.Geometry as GeoJsonPoint<GeoJson2DCoordinates>;
                return new
                {
                    id = geo.Id,
                    name = geo.Name,
                    lat = point.Coordinates.Y,
                    lon = point.Coordinates.X
                };
            }
            else if (geo.Geometry.Type == GeoJsonObjectType.Polygon)
            {
                var polygon = geo.Geometry as GeoJsonPolygon<GeoJson2DCoordinates>;
                var coords = polygon.Coordinates.Exterior.Positions
                    .Select(c =>  new List<double> {c.Y, c.X}) // [lat, lon]
                    .ToList();
                return new
                {
                    id = geo.Id,
                    name = geo.Name,
                    coordinates = coords
                };
            }
            return null;
        }

        
        /// <summary>
        /// POST api/geo
        /// Create a new GeoLocation from request data
        /// </summary>
        /// <param name="doc">request body</param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        public async Task<IActionResult> CreateGeoLocation([FromBody] JObject doc)
        {
            if (doc == null) return BadRequest();

            GeoData geoData;

            if (doc.ContainsKey("lat"))  // Point
            {
                var obj = doc.ToObject<GeoObjectDto>();
                geoData = new GeoData
                {
                    Id = obj.Id,
                    Name = obj.Name,
                    Geometry = new GeoJsonPoint<GeoJson2DCoordinates>(new GeoJson2DCoordinates(obj.Lon, obj.Lat))
                };
            }
            else if (doc.ContainsKey("coordinates")) // Polygon
            {
                var obj = doc.ToObject<GeoPolygonDto>();
                var coords = obj.Coordinates
                    .Select(c => new GeoJson2DCoordinates(c[1], c[0])) // Mongo stores lon,lat
                    .ToList();

                // Ensure ring is closed
                if (coords.First().X != coords.Last().X || coords.First().Y != coords.Last().Y)
                {
                    coords.Add(coords.First());
                }
                geoData = new GeoData
                {
                    Id = obj.Id,
                    Name = obj.Name,
                    Geometry = new GeoJsonPolygon<GeoJson2DCoordinates>(
                        new GeoJsonPolygonCoordinates<GeoJson2DCoordinates>(
                            new GeoJsonLinearRingCoordinates<GeoJson2DCoordinates>(coords)
                        )
                    )
                };
            }
            else
            {
                return BadRequest(new { error = "Invalid GeoLocation data" });
            }

            await _collection.InsertOneAsync(geoData);
            return Ok(geoData);
        }

        /// <summary>
        /// GET api/geo/{id}
        /// Get single GeoLocation by ID
        /// </summary>
        /// <param name="id">Location ID</param>
        /// <returns>ActionResult</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLocationById(string id)
        {
            var data = await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (data == null)
            {
                return NotFound(new { error = $"GeoLocation with Id {id} not found" });
            }
            return Ok(GeoToDto(data));
        }

        /// <summary>
        /// GET /api/geo
        /// Get all GeoLocations
        /// </summary>
        /// <returns>ActionResult</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllLocations()
        {
            var data = await _collection.Find(_ => true).ToListAsync();
            return Ok(data.Select(GeoToDto));
        }

        /// <summary>
        /// DELETE api/geo/{id}
        /// Delete GeoLocation by ID
        /// </summary>
        /// <param name="id">Location ID</param>
        /// <returns>ActionResult</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGeoLocation(string id)
        {
            var result = await _collection.DeleteOneAsync(x => x.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { error = $"GeoLocation with Id {id} not found" });
            }
            return NoContent();
        }
    }
}
