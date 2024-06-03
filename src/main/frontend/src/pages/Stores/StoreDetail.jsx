import React, { Fragment, useState } from 'react';
import Footer from "../../components/Footer";
import { Box, Grid, Paper, Tab, Tabs, Typography, } from '@mui/material/';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import StoreInfo from './StoreInfo';
import StoreMenuList from './StoreMenuList';
import SearchHeader from '../../components/SearchHeader';
import { useDibs } from '../Dibs/Hook/useDibs';
import { useStoreDeatilByEmail } from '../../utils/storeInfo';
import { useQueryClient } from '@tanstack/react-query';
import BackDrop from '../../components/BackDrop';
import StoreReviews from '../Review/View/StoreReviews';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function StoreDetail() {
  const queryClient = useQueryClient();
  const email = localStorage.getItem('email')
  const role = localStorage.getItem('role')
  const { storeId } = useParams()
  const { isLoading, storeDetail } = useStoreDeatilByEmail(email, storeId);
  const { postDibStore } = useDibs();
  const [value, setValue] = useState(1);
  const [popularity, setPopularity] = useState('');

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleDib = (isDibed) => {
    if(isDibed===null) {
      postDibStore.mutate({email: email, storeId: storeId, status: '찜'}, {
        onSuccess: () => {console.log('찜 성공'); queryClient.invalidateQueries(['storeDetail', {storeId: storeId}])},
        onError: e => {alert('찜 등록에 문제가 발생했습니다.'); console.error(e)}
      })
      return;
    }

    if(isDibed==='일반') {
      postDibStore.mutate({email: email, storeId: storeId, status: '찜'}, {
        onSuccess: () => {console.log('찜 성공'); queryClient.invalidateQueries(['storeDetail', {storeId: storeId}])},
        onError: e => {alert('찜 등록에 문제가 발생했습니다.'); console.error(e)}
      })
    } else if (isDibed==='찜') {
      postDibStore.mutate({email: email, storeId: storeId, status: '일반'}, {
        onSuccess: () => {console.log('일반 성공'); queryClient.invalidateQueries(['storeDetail', {storeId: storeId}])},
        onError: e => {alert('찜 등록에 문제가 발생했습니다.'); console.error(e)}
      })
    }
  }

  return (
    <Box sx={{ margin: -1 }}>
    {/* <Box sx={{ height: 'auto', backgroundImage: 'url(/img/sl0.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'lighten', backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', flexDirection: 'column' }}> */}
    <Paper elevation={3} sx={{height: '100vh', backgroundImage: 'url(/img/sl0.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'lighten', backgroundColor: 'rgba(255, 255, 255, 0.6)', p: 2, overflowY: 'auto' }}>
      <SearchHeader />
      {isLoading && <BackDrop isLoading={isLoading} />}
      {!isLoading && storeDetail && 
      <Fragment>
      <Box sx={{ borderBottom: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0 }}></Box>
          <Tab label="메뉴" {...a11yProps(1)} sx={{ marginLeft: 2, marginRight: 2 }} />
          <Tab label="가게·원산지 정보" {...a11yProps(2)} autoFocus sx={{ marginLeft: 2, marginRight: 2 }} />
          <Tab label="리뷰" {...a11yProps(3)} autoFocus sx={{ marginLeft: 2, marginRight: 2 }} />
        </Tabs>
      </Box>
        <Grid container>
          <Grid item xs={2} />
          <Grid item xs>
            <Typography variant='h4' sx={{textAlign:'center', mt: 3}}>{storeDetail.name} 
              {role!=='점주' && storeDetail.isDibed==='일반' || storeDetail.isDibed===null ? 
                <FavoriteIcon sx={{cursor:'pointer', fontSize:30, mb:1, ":hover":{color:'red'}}} onClick={() => handleDib(storeDetail.isDibed)} />
                :
                <FavoriteIcon sx={{cursor:'pointer', fontSize:30, color:'red', mb:1}} onClick={() => handleDib(storeDetail.isDibed)} />
              } 
            </Typography>
          </Grid>
          <Grid item xs={2} /> 
        </Grid>
      <CustomTabPanel value={value} index={1}>
        <StoreMenuList storeName={storeDetail.name} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StoreInfo storeDetail={storeDetail} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <StoreReviews storeId={storeId} />
      </CustomTabPanel>
      <Footer />
      </Fragment>
      }
    {/* </Box> */}
    </Paper>
    </Box>
  );
}