using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace IAIAppBackend.Models
{
   public enum GeoType
    {
        Point,
        Polygon
    }
    public class GeoData
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public GeoJsonGeometry<GeoJson2DCoordinates> Geometry { get; set; } = null!; // Can store a point or a polygon

    }
}
