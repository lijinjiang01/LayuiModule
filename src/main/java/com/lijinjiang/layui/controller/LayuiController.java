package com.lijinjiang.layui.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Description 跳转页面控制器
 * @Author 03010430
 * @ModifyDate 2023/6/8 13:06
 */
@RestController
@RequestMapping("/layui")
public class LayuiController {
    @GetMapping("/iconPicker")
    public ModelAndView showIconPicker() {
        return gotoPage("/iconPicker/demo");
    }

    //跳转页面
    public ModelAndView gotoPage(String path) {
        ModelAndView view = new ModelAndView();
        view.setViewName(path);
        return view;
    }
}
