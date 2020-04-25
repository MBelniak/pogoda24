package com.rubik.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .passwordEncoder(new BCryptPasswordEncoder(10))
                .withUser("Pogoda24")
                .password("$2a$10$wmUD40dcQ.t/.vFIRmD8suiATUMvbNuzIXA.FJpLpEB.09XujKs9.")
                .roles("ADMIN");
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf()
                .disable()
                .headers()
                .frameOptions()
                .disable()
                .and()
                .authorizeRequests()
                .antMatchers("/write/login")
                .not().authenticated()
                .antMatchers("/write", "/write/**", "/console", "/console/**")
                .authenticated()
                .antMatchers(HttpMethod.POST,"/api/**")
                .authenticated()
                .antMatchers(HttpMethod.PUT, "/api/**")
                .authenticated()
                .antMatchers(HttpMethod.DELETE, "/api/**")
                .authenticated()
                .antMatchers("/", "/prognozy", "/ciekawostki", "/ostrzezenia", "/about", "/login")
                .permitAll()
                .and()
                .formLogin();
//                .loginPage("/write/login")
//                .failureUrl("/write/login?error=true")
//                .defaultSuccessUrl("/write?login=success")
//                .and()
//                .logout()
//                .invalidateHttpSession(true)
//                .clearAuthentication(true)
//                .logoutRequestMatcher(new AntPathRequestMatcher("/write/logout"))
//                .logoutSuccessUrl("/write/login?logout=success");
    }

    @Override
    public void configure(WebSecurity web){
        web.ignoring().antMatchers("/resources/**", "/static/**", "/css/**", "/js/**");
    }

}
