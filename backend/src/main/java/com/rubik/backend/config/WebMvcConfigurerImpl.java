package com.rubik.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@ComponentScan("com.rubik.backend")
public class WebMvcConfigurerImpl implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/admin/**").addResourceLocations("classpath:admin/");
        registry.addResourceHandler("/static/generator/**").addResourceLocations("classpath:generator/");
        registry.addResourceHandler("/static/templates/**").addResourceLocations("classpath:templates/");
        registry.addResourceHandler("/generator/**").addResourceLocations("classpath:generator/");
        registry.addResourceHandler("/templates/**").addResourceLocations("classpath:templates/");
        registry.addResourceHandler("/admin/**").addResourceLocations("classpath:admin/");
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:public/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:public/");
    }

    @Bean
    public ViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/");
        resolver.setSuffix(".html");
        return resolver;
    }

}
