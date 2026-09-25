package com.grocery.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DbUpdateConfig {
    @Bean
    public CommandLineRunner updateDb(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE products MODIFY COLUMN image_url LONGTEXT;");
                System.out.println("Successfully altered products.image_url to LONGTEXT");
            } catch (Exception e) {
                System.out.println("Notice altering table: " + e.getMessage());
            }
        };
    }
}
