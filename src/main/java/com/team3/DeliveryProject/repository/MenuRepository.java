package com.team3.DeliveryProject.repository;

import com.team3.DeliveryProject.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository  extends JpaRepository<Menu, Long> {
}