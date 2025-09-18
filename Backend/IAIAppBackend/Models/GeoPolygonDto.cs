namespace IAIAppBackend.Models
{
    public class GeoPolygonDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public List<List<double>> Coordinates { get; set; } = null!; // List of linear rings, each ring is a list of [longitude, latitude] pairs
    }
}
