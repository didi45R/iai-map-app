namespace IAIAppBackend.Models
{
    public class GeoObjectDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public double Lat { get; set; }
        public double Lon { get; set; }
    }
}
