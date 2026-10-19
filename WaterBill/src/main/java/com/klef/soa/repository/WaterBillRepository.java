package com.klef.soa.repository;

import org.springframework.stereotype.Repository;

import com.klef.soa.entity.WaterBill;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface WaterBillRepository extends JpaRepository<WaterBill, Long>{
	
	List<WaterBill> findByHolderName(String holderName);
	List<WaterBill> findByType(String type);
	

}
