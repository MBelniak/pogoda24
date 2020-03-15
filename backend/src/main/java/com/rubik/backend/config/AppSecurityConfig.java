package com.rubik.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
//@EnableWebSecurity
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {

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
                .antMatchers("/**")//, "/users/**")
                .permitAll();
//                .antMatchers("/logout")
//                .authenticated()
//                .antMatchers("/console", "/console/**")
//                .hasAnyAuthority("ADMIN")
//                .antMatchers("/login", "/register")
//                .not().authenticated()
//                .anyRequest()
//                .authenticated()
//                .and()
//                .formLogin()
//                .loginPage("/login")
//                .failureUrl("/login?error=true")
//                .defaultSuccessUrl("/?login=success")
//                .and()
//                .logout()
//                .invalidateHttpSession(true)
//                .clearAuthentication(true)
//                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                .logoutSuccessUrl("/?logout=success");
    }

    @Override
    public void configure(WebSecurity web){
        web.ignoring().antMatchers("/resources/**", "/static/**", "/css/**", "/js/**");
    }

}
