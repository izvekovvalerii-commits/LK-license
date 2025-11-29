package com.licensing.portal.service;

import com.licensing.portal.model.Store;
import com.licensing.portal.model.User;
import com.licensing.portal.repository.StoreRepository;
import com.licensing.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@licensing.com");
            admin.setFullName("Администратор Системы");
            admin.setPosition("Системный администратор");
            admin.setDepartment("ИТ отдел");

            Set<String> adminRoles = new HashSet<>();
            adminRoles.add("ADMIN");
            adminRoles.add("MANAGER");
            admin.setRoles(adminRoles);
            admin.setIsActive(true);

            userRepository.save(admin);
            System.out.println("Admin user created: username=admin, password=admin123");
        }

        // Create default manager user
        if (!userRepository.existsByUsername("manager")) {
            User manager = new User();
            manager.setUsername("manager");
            manager.setPasswordHash(passwordEncoder.encode("manager123"));
            manager.setEmail("manager@licensing.com");
            manager.setFullName("Иванов Иван Иванович");
            manager.setPosition("Руководитель отдела лицензирования");
            manager.setDepartment("Отдел лицензирования");

            Set<String> managerRoles = new HashSet<>();
            managerRoles.add("MANAGER");
            manager.setRoles(managerRoles);
            manager.setIsActive(true);

            userRepository.save(manager);
            System.out.println("Manager user created: username=manager, password=manager123");
        }

        // Create user2 with same rights as manager
        if (!userRepository.existsByUsername("user2")) {
            User user2 = new User();
            user2.setUsername("user2");
            user2.setPasswordHash(passwordEncoder.encode("user2123"));
            user2.setEmail("user2@licensing.com");
            user2.setFullName("Петров Петр Петрович");
            user2.setPosition("Менеджер отдела лицензирования");
            user2.setDepartment("Отдел лицензирования");

            Set<String> user2Roles = new HashSet<>();
            user2Roles.add("MANAGER");
            user2.setRoles(user2Roles);
            user2.setIsActive(true);

            userRepository.save(user2);
            System.out.println("User2 created: username=user2, password=user2123");
        }

        // Create 50+ sample stores with realistic data
        if (storeRepository.count() < 10) {
            createStores();
        } else {
            // Update existing stores with new fields if they are missing
            updateExistingStores();
        }
    }

    private void updateExistingStores() {
        var stores = storeRepository.findAll();
        java.time.LocalDate now = java.time.LocalDate.now();

        for (int i = 0; i < stores.size(); i++) {
            Store store = stores.get(i);

            // Only update if MVZ is null (meaning new fields haven't been set)
            if (store.getMvz() == null) {
                // Generate MVZ
                store.setMvz(String.format("13CT%04d", 1000 + i));

                // ЦФО
                store.setCfo("E1028750");

                // ОКТМО
                String[] oktmoValues = { "45339000", "45780000", "45398000", "45111000" };
                store.setOktmo(oktmoValues[i % oktmoValues.length]);

                // Has restriction
                store.setHasRestriction(i % 5 == 0);

                // Municipal area and district
                String[] munAreas = { "Москва", "Санкт-Петербург", "Московская область", "Ленинградская область" };
                String[] munDistricts = { "Москва", "Центральный", "Невский", "Подольск", "Красногорск" };
                store.setMunArea(munAreas[i % munAreas.length]);
                store.setMunDistrict(munDistricts[i % munDistricts.length]);

                // БЕ
                String[] beValues = { "ООО «Агроторг»", "ООО «Перекресток»", "ООО «Дикси Юг»", "ООО «Магнит»" };
                store.setBe(beValues[i % beValues.length]);

                // Close date
                if (i % 10 == 9) {
                    store.setCloseDate(now.plusMonths(1 + i % 6));
                } else {
                    store.setCloseDate(null);
                }

                storeRepository.save(store);
            }
        }

        System.out.println("Updated " + stores.size() + " existing stores with new fields");
    }

    private void createStores() {
        String[] storeNames = {
                "Продукты 24", "Магнит", "Пятёрочка", "Перекрёсток", "Дикси",
                "Алкомаркет", "Табачная лавка", "Винотека", "Сигары и табак", "Алко-Сити",
                "Продмаг №1", "Универсам", "Гастроном", "Супермаркет Центральный", "Народный",
                "Красное & Белое", "Бристоль", "Виктория", "Монетка", "Копейка",
                "Семья", "Лента", "О'Кей", "Ашан", "Метро",
                "Верный", "Авоська", "Пятачок", "Карусель", "Глобус",
                "Магнолия", "Рублёвский", "Азбука Вкуса", "Фреш Маркет", "Вкусвилл",
                "Бахетле", "Спар", "Атак", "Командор", "Виват",
                "Слата", "Магнум", "Квартал", "Соседи", "Наш Магазин",
                "Добрый", "Светофор", "Мария-Ра", "Гроздь", "Купец",
                "Алые Паруса", "Золотая Нива", "Радуга", "Изобилие", "Урожай"
        };

        String[] districts = {
                "Центральный", "Северный", "Южный", "Восточный", "Западный",
                "Тверской", "Пресненский", "Арбат", "Хамовники", "Замоскворечье"
        };

        String[] streets = {
                "Ленина", "Пушкина", "Гоголя", "Чехова", "Тургенева",
                "Тверская", "Арбат", "Невский проспект", "Садовая", "Кутузовский проспект",
                "Ленинградский проспект", "Мира", "Вернадского", "Ломоносова", "Менделеева"
        };

        java.time.LocalDate now = java.time.LocalDate.now();

        for (int i = 0; i < storeNames.length; i++) {
            Store store = new Store();
            store.setName(storeNames[i]);

            // Generate address
            String district = districts[i % districts.length];
            String street = streets[i % streets.length];
            int building = 1 + (i * 7) % 150;
            store.setAddress(String.format("г. Москва, %s р-н, ул. %s, д. %d", district, street, building));

            // Generate director phone
            int phoneNum = 1000000 + (i * 123456) % 9000000;
            store.setDirectorPhone(String.format("+7 (495) %03d-%02d-%02d",
                    phoneNum / 10000, (phoneNum / 100) % 100, phoneNum % 100));

            // Generate INN (12 digits)
            String inn = String.format("77%010d", 1234567890L + i);
            store.setInn(inn);

            // Generate KPP
            store.setKpp(String.format("77%02d01001", (i % 50) + 1));

            // Contact person
            String[] firstNames = { "Иван", "Петр", "Сергей", "Алексей", "Дмитрий", "Андрей", "Михаил", "Владимир" };
            String[] lastNames = { "Иванов", "Петров", "Сидоров", "Смирнов", "Кузнецов", "Попов", "Васильев",
                    "Соколов" };
            store.setContactPerson(String.format("%s %s Иванович",
                    lastNames[i % lastNames.length], firstNames[i % firstNames.length]));

            // Phone
            int officePhone = 2000000 + (i * 234567) % 8000000;
            store.setPhone(String.format("+7 (495) %03d-%02d-%02d",
                    officePhone / 10000, (officePhone / 100) % 100, officePhone % 100));

            // Email
            store.setEmail(storeNames[i].toLowerCase().replaceAll("[^a-zа-я0-9]", "") + "@example.com");

            // New fields
            // Generate MVZ (8-character код)
            store.setMvz(String.format("13CT%04d", 1000 + i));

            // ЦФО - using a standard value
            store.setCfo("E1028750");

            // ОКТМО - varying values
            String[] oktmoValues = { "45339000", "45780000", "45398000", "45111000" };
            store.setOktmo(oktmoValues[i % oktmoValues.length]);

            // Has restriction - ~20% of stores have restrictions
            store.setHasRestriction(i % 5 == 0);

            // Municipal area and district
            String[] munAreas = { "Москва", "Санкт-Петербург", "Московская область", "Ленинградская область" };
            String[] munDistricts = { "Москва", "Центральный", "Невский", "Подольск", "Красногорск" };
            store.setMunArea(munAreas[i % munAreas.length]);
            store.setMunDistrict(munDistricts[i % munDistricts.length]);

            // БЕ (Балансовая единица)
            String[] beValues = { "ООО «Агроторг»", "ООО «Перекресток»", "ООО «Дикси Юг»", "ООО «Магнит»" };
            store.setBe(beValues[i % beValues.length]);

            // Close date - ~10% of stores are scheduled to close
            if (i % 10 == 9) {
                store.setCloseDate(now.plusMonths(1 + i % 6));
            } else {
                store.setCloseDate(null);
            }

            // License expiration dates - create variety of statuses
            int licensePattern = i % 6;
            switch (licensePattern) {
                case 0: // Both licenses valid for long time
                    store.setAlcoholLicenseExpiry(now.plusMonths(6 + i % 12));
                    store.setTobaccoLicenseExpiry(now.plusMonths(8 + i % 10));
                    break;
                case 1: // Alcohol expired, tobacco valid
                    store.setAlcoholLicenseExpiry(now.minusMonths(1 + i % 6));
                    store.setTobaccoLicenseExpiry(now.plusMonths(3 + i % 9));
                    break;
                case 2: // Tobacco expired, alcohol valid
                    store.setAlcoholLicenseExpiry(now.plusMonths(4 + i % 8));
                    store.setTobaccoLicenseExpiry(now.minusMonths(2 + i % 5));
                    break;
                case 3: // Both expiring soon (within 30 days)
                    store.setAlcoholLicenseExpiry(now.plusDays(5 + i % 25));
                    store.setTobaccoLicenseExpiry(now.plusDays(10 + i % 20));
                    break;
                case 4: // Only alcohol license
                    store.setAlcoholLicenseExpiry(now.plusMonths(2 + i % 10));
                    store.setTobaccoLicenseExpiry(null);
                    break;
                case 5: // Only tobacco license
                    store.setAlcoholLicenseExpiry(null);
                    store.setTobaccoLicenseExpiry(now.plusMonths(3 + i % 8));
                    break;
            }

            store.setIsActive(true);
            storeRepository.save(store);
        }

        System.out.println("Created " + storeNames.length + " sample stores with license data");
    }
}
