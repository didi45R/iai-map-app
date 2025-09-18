using Microsoft.Extensions.Options;
using MongoDB.Driver;
using IAIAppBackend.Models;

namespace IAIAppBackend.Services
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = "";
        public string DatabaseName { get; set; } = "";
        public string CollectionName { get; set; } = "";
    }

    public interface IMongoService
    {
        IMongoCollection<GeoData> Collection { get; }
        Task EnsureIndexesAsync();
    }

    public class MongoService : IMongoService
    {
        public IMongoCollection<GeoData> Collection { get; }
        private readonly IMongoDatabase _db;

        public MongoService(IOptions<MongoSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            _db = mongoClient.GetDatabase(settings.Value.DatabaseName);
            Collection = _db.GetCollection<GeoData>(settings.Value.CollectionName);
        }

        public async Task EnsureIndexesAsync()
        {
            var indexKeys = Builders<GeoData>.IndexKeys.Geo2DSphere("geometry");
            var indexModel = new CreateIndexModel<GeoData>(indexKeys);
            await Collection.Indexes.CreateOneAsync(indexModel);
        }
    }
}
