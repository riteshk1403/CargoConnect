package com.cargoconnect.service;

import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Customer;
import com.cargoconnect.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        Customer cust = getCustomerById(id);
        cust.setName(updated.getName());
        cust.setPhone(updated.getPhone());
        cust.setCompanyName(updated.getCompanyName());
        cust.setAddress(updated.getAddress());
        cust.setCorporate(updated.isCorporate());
        if (updated.getCreditLimit() != null) {
            cust.setCreditLimit(updated.getCreditLimit());
        }
        return customerRepository.save(cust);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
