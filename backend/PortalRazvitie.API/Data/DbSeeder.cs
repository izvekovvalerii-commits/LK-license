using Bogus;
using PortalRazvitie.API.Models;

namespace PortalRazvitie.API.Data;

public static class DbSeeder
{
    public static void SeedStores(ApplicationDbContext context)
    {
        if (context.Stores.Any())
            return;

        var cities = new[] { "Москва", "Санкт-Петербург", "Казань", "Нижний Новгород", "Екатеринбург", "Новосибирск", "Омск", "Челябинск", "Самара", "Воронеж" };
        var regions = new[] { "Московская область", "Ленинградская область", "Татарстан", "Нижегородская область", "Свердловская область", "Новосибирская область", "Омская область", "Челябинская область", "Самарская область", "Воронежская область" };

        var faker = new Faker<Store>("ru")
            .RuleFor(s => s.Code, f => $"СТ-{f.Random.Number(1000, 9999)}")
            .RuleFor(s => s.Name, f => $"Чижик {f.Address.StreetName()}")
            .RuleFor(s => s.Address, f => f.Address.FullAddress())
            .RuleFor(s => s.City, f => f.PickRandom(cities))
            .RuleFor(s => s.Region, f => f.PickRandom(regions))
            .RuleFor(s => s.TotalArea, f => Math.Round(f.Random.Double(250, 1500), 2))
            .RuleFor(s => s.TradeArea, (f, s) => Math.Round(s.TotalArea * f.Random.Double(0.6, 0.85), 2))
            .RuleFor(s => s.Status, f => f.PickRandom("Active", "Planning", "Renovation"))
            .RuleFor(s => s.OpeningDate, f => DateTime.SpecifyKind(f.Date.Between(DateTime.Now.AddYears(-5), DateTime.Now), DateTimeKind.Utc))
            .RuleFor(s => s.CreatedAt, f => DateTime.UtcNow);

        var stores = faker.Generate(50);
        context.Stores.AddRange(stores);
        context.SaveChanges();
    }
}
