package com.example.crud_user_api;

import com.example.crud_user_api.service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class CrudUserApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(CrudUserApplication.class, args);
		UserService userService = context.getBean(UserService.class);
		userService.initAdminUser();
	}
}
