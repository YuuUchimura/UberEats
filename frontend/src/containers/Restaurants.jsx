// lib
import React, { Fragment, useEffect, useReducer } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// apis
import { fetchRestaurants } from "../apis/restaurants";

// reducers
import {
  initialState,
  restaurantsActionTypes,
  restaurantsReducer,
} from "../reducers/restaurants";

// images
import MainLogo from "../images/logo.png";
import MainCoverImage from "../images/main-cover-image.png";
import RestaurantImage from "../images/restaurant-image.jpg";

// material-ui
import Skeleton from "@material-ui/lab/Skeleton";

// components
import { REQUEST_STATE } from "../constants";

// styled-cmponents
import { HeaderWrapper, MainLogoImage } from "../components/StyledHeader";
const MainCoverImageWrapper = styled.div`
  text-align: center;
`;
const MainCover = styled.img`
  height: 600px;
`;
const RestaurantsContentsList = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 150px;
`;
const RestaurantsContentWrapper = styled.div`
  width: 450px;
  height: 300px;
  padding: 48px;
`;
const RestaurantsImageNode = styled.img`
  width: 100%;
`;
const MainText = styled.p`
  color: black;
  font-size: 18px;
`;
const SubText = styled.p`
  color: black;
  font-size: 12px;
`;

// FC
export const Restaurants = () => {
  const [state, dispatch] = useReducer(restaurantsReducer, initialState);

  useEffect(() => {
    dispatch({ type: restaurantsActionTypes.FETCHING });
    fetchRestaurants().then((data) => {
      // fetchRestaurantsは成功した場合にはres.dataを返すのででAPIの返り値を取得できる
      dispatch({
        type: restaurantsActionTypes.FETCH_SUCCESS,
        payload: {
          restaurants: data.restaurants,
        },
      });
    });
  }, []);

  return (
    <Fragment>
      <HeaderWrapper>
        <MainLogoImage src={MainLogo} alt="main logo" />
      </HeaderWrapper>
      <MainCoverImageWrapper>
        <MainCover src={MainCoverImage} alt="main cover" />
      </MainCoverImageWrapper>
      <RestaurantsContentsList>
        {state.fetchState === REQUEST_STATE.LOADING ? (
          // ロード中はこちらが表示される
          <Fragment>
            <Skeleton variant="rect" width={450} height={300} />
            <Skeleton variant="rect" width={450} height={300} />
            <Skeleton variant="rect" width={450} height={300} />
          </Fragment>
        ) : (
          // ロードが完了し、REQUEST_STATE.OKになったらこちらが表示される
          state.restaurantsList.map((item, index) => (
            <Link
              to={`/restaurants/${item.id}/foods`}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <RestaurantsContentWrapper>
                <RestaurantsImageNode src={RestaurantImage} />
                <MainText>{item.name}</MainText>
                <SubText>{`配送料:${item.fee}円 ${item.time_required}分`}</SubText>
              </RestaurantsContentWrapper>
            </Link>
          ))
        )}
      </RestaurantsContentsList>
    </Fragment>
  );
};
