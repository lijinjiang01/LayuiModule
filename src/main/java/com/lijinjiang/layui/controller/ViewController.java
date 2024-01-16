package com.lijinjiang.layui.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Description 跳转页面控制器
 * @Author 03010430
 * @ModifyDate 2023/6/8 13:06
 */
@RestController
public class ViewController {
    @GetMapping("")
    public ModelAndView index() {
        return new ModelAndView("/index");
    }

    @GetMapping("/icon/index")
    public ModelAndView iconIndex() {
        return new ModelAndView("/icon/index");
    }

    @GetMapping("/icon/iconPicker")
    public ModelAndView iconPicker() {
        return new ModelAndView("/icon/iconPicker");
    }

}
