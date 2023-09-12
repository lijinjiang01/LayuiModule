package com.lijinjiang.layui.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description API控制器
 * @Author 03010430
 * @ModifyDate 2023/9/12 14:04
 */
@RestController
@RequestMapping("/api/v1/")
public class ApiController {

    @GetMapping("/users")
    public void listUsers() {

    }
}
