package com.team3.DeliveryProject.service;

import static com.team3.DeliveryProject.responseCode.ErrorCode.USERNAME_IS_ALREADY_EXIST;
import static com.team3.DeliveryProject.responseCode.ErrorCode.USER_EMAIL_IS_ALREADY_EXIST;
import static com.team3.DeliveryProject.responseCode.ResponseCode.USER_DELETE_SUCCESS;
import static com.team3.DeliveryProject.responseCode.ResponseCode.USER_SIGNUP_SUCCESS;
import static com.team3.DeliveryProject.responseCode.ResponseCode.USER_UPDATE_SUCCESS;

import com.team3.DeliveryProject.dto.common.Response;
import com.team3.DeliveryProject.entity.Address;
import com.team3.DeliveryProject.entity.Users;
import com.team3.DeliveryProject.repository.AddressRepository;
import com.team3.DeliveryProject.repository.UsersRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{
    private final UsersRepository usersRepository;
    private final AddressRepository addressRepository;


    @Override
    public ResponseEntity<Response> signUp(Users user) {
        if (usersRepository.findUsersByUserId(user.getUserId()).isPresent()){
            return Response.toResponseEntity(USERNAME_IS_ALREADY_EXIST);
        } else if (usersRepository.findUsersByEmail(user.getEmail()).isPresent()) {
            return Response.toResponseEntity(USER_EMAIL_IS_ALREADY_EXIST);
        }else{
            Users tmpUser = new Users(" ", user.getName(), user.getPhone(), user.getEmail(),0,
                user.getRole(), user.getCurrentAddress(), user.getAddressCode(),LocalDateTime.now(),LocalDateTime.now(), "일반", 0);
            usersRepository.save(tmpUser);

            Address address = new Address(tmpUser.getUserId(), tmpUser.getCurrentAddress(), tmpUser.getAddressCode(),
                LocalDateTime.now(),LocalDateTime.now(),"일반");
            addressRepository.save(address);
            return Response.toResponseEntity(USER_SIGNUP_SUCCESS);
        }
    }

    @Override
    public ResponseEntity<Response> updateUser(Users user) {
        Users users = usersRepository.findUsersByEmail(user.getEmail()).get();
        users.setPhone(user.getPhone());
        users.setName(user.getName());
        users.setCurrentAddress(user.getCurrentAddress());
        users.setAddressCode(user.getAddressCode());
        Long userId = usersRepository.save(users).getUserId();
        Address address = addressRepository.findAddressByUserId(userId).get();
        address.setAddress(users.getCurrentAddress());
        address.setAddressCode(users.getAddressCode());
        addressRepository.save(address);
        return Response.toResponseEntity(USER_UPDATE_SUCCESS);
    }

    @Override
    public ResponseEntity<Response> deleteUser(Users user) {
        Users users = usersRepository.findUsersByEmail(user.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        users.setStatus("탈퇴");
        usersRepository.save(users);
        return Response.toResponseEntity(USER_DELETE_SUCCESS);
    }
}
