import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { useOrderOwner } from "./Hook/useOrderOwner";
import OwnerOrderDetail from "./OwnerOrderDetail";
import BackDrop from "../../components/BackDrop";

export default function OwnerOrderList() {
  const location = useLocation();
  const email = localStorage.getItem('email');
  const eventSource = new EventSource(`/dp/orders/stream/${email}`);
  const { storeId, storeName } = location.state;
  const { getOwnerOrderListByEmail: { isLoading, data: orderData }, updateOrderStatus } = useOrderOwner(email, storeId);
  const [openPortal, setOpenPortal] = useState(false);
  const [activeIndex, setActiveIndex] = useState('');

  const handleClick = index => {
    setOpenPortal(!openPortal);
    setActiveIndex(index);
  }

  const handleUpdateStatus = orderId => {
    if (window.confirm('주문을 접수 받으시겠습니까?')) {
      updateOrderStatus.mutate({ orderId: orderId, status: '조리중' }, {
        onSuccess: () => {
          eventSource.onmessage = function (event) {
            const orderData = JSON.parse(event.data);
            console.log("Order updated:", orderData);
          };
        },
        onError: () => {
          eventSource.onerror = function (event) {
            console.error("EventSource failed:", event);
          };
        }
      })
    } else {
      return;
    }
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f4f6f8' }}>
      {isLoading && <BackDrop isLoading={isLoading} />}
      {!isLoading && orderData &&
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ textAlign: 'center', my: 3, fontWeight: 'bold' }}>주문 내역</Typography>
            <Divider sx={{ marginBottom: 3 }} />
            <Typography variant="h5" sx={{ textAlign: 'center', my: 2, color: '#3f51b5' }}>{storeName}</Typography>
            {orderData.data.orders.map((menu, idx) => (
              <Card key={idx} sx={{ my: 2, p: 2, boxShadow: 3 }} variant="outlined">
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>주문 번호: {menu.orderId}</Typography>
                <CardContent onClick={() => handleClick(menu.orderId)} sx={{ cursor: 'pointer' }}>
                  <Typography variant="body1">메뉴 명: {menu.menuName} {(menu.count !== 0) ? '외 ' + menu.count + '개' : ''}</Typography>
                  <Typography variant="body1">최종 금액: {menu.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</Typography>
                  <Typography variant="body1" sx={{ color: (menu.status === '완료' ? 'green' : 'blue') }}>주문 상태: {menu.status}</Typography>
                </CardContent>
                <CardActions>
                  {menu.status === '접수대기' ?
                    <Button variant="contained" color="primary" onClick={() => handleUpdateStatus(menu.orderId)}>주문 접수하기</Button>
                    :
                    <Button variant="contained" disabled>주문 접수하기</Button>
                  }
                </CardActions>
                {openPortal && activeIndex === menu.orderId && <OwnerOrderDetail isPortalOpen={{ openPortal }} email={email} orderId={menu.orderId} />}
              </Card>
            ))}
          </Grid>
        </Grid>
      }
    </Box>
  );
}
