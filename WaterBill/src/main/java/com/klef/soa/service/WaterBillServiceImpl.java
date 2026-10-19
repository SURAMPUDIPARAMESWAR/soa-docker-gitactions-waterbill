package com.klef.soa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.entity.WaterBill;
import com.klef.soa.repository.WaterBillRepository;

@Service
public class WaterBillServiceImpl implements WaterBillService {

	@Autowired
	private WaterBillRepository repo;
	
	@Override
	public WaterBill addWaterBill(WaterBill wb) {
		return repo.save(wb);
	}

	@Override
	public WaterBill updateWaterBill(WaterBill wb) {
		Optional<WaterBill> optional = repo.findById(wb.getWaterBillId());
		
		if(optional.isPresent()) {
			
			WaterBill waterbill = optional.get();
			
			waterbill.setHolderName(wb.getHolderName());
			waterbill.setType(wb.getType());
			waterbill.setStatus(wb.getStatus());
			waterbill.setLocation(wb.getLocation());
			
			return repo.save(waterbill);
		}
		else {
			return null;
		}
	}

	@Override
	public List<WaterBill> displayAllWaterBills() {
		return repo.findAll();
	}

	@Override
	public WaterBill displayWaterBillById(Long id) {
		return repo.findById(id).orElse(null);
	}

	@Override
	public String deleteWaterBillById(Long id) {
		boolean flag  = repo.existsById(id);
		
		if(flag) {
			repo.deleteById(id);
			return "WaterBill Deleted Successfully";
		}
		else {
			return "WaterBill ID Not Found";
		}
	}

	@Override
	public List<WaterBill> displayWaterBillByHolderName(String name) {
		return repo.findByHolderName(name);
	}

	@Override
	public List<WaterBill> displayWaterBillByType(String type) {
		return repo.findByType(type);
	}

}
