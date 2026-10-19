package com.klef.soa.service;

import java.util.List;

import com.klef.soa.entity.WaterBill;

public interface WaterBillService  {
	
	WaterBill addWaterBill(WaterBill wb);
	WaterBill updateWaterBill(WaterBill wb);
	List<WaterBill> displayAllWaterBills();
	WaterBill displayWaterBillById(Long id);
	String deleteWaterBillById(Long id);
	List<WaterBill> displayWaterBillByHolderName(String name);
	List<WaterBill> displayWaterBillByType(String type);

}
