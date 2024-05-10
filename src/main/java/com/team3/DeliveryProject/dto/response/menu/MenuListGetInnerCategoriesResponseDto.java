package com.team3.DeliveryProject.dto.response.menu;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuListGetInnerCategoriesResponseDto {

    private String category;
    private List<MenuListGetInnerMenusResponseDto> menus;
}
