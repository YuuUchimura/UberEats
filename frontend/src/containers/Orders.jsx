//lib
import React, { Fragment, useEffect, useReducer } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//components
import { OrderDetailItem } from "../components/OrderDetailItem";
import { OrderButton } from "../components/Buttons/OrderButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// apis
import { fetchLineFoods } from "../apis/line_foods";
import { postOrder } from "../apis/orders";

//reducers
import {
  initialState,
  lineFoodsActionsTypes,
  lineFoodsReducer,
} from "../reducers/lineFoods";

//images
import MainLogo from "../images/logo.png";

//constants
import { REQUEST_STATE } from "../constants";

//styled-component
import { HeaderWrapper, MainLogoImage } from "../components/StyledHeader";
const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderItemWrapper = styled.div`
  margin-bottom: 50px;
`;

//FC
export const Orders = () => {
  const [state, dispatch] = useReducer(lineFoodsReducer, initialState);

  useEffect(() => {
    dispatch({ type: lineFoodsActionsTypes.FETCHING });
    fetchLineFoods()
      .then((data) =>
        dispatch({
          type: lineFoodsActionsTypes.FETCH_SUCCESS,
          payload: {
            lineFoodsSummary: data,
          },
        })
      )
      .catch((e) => console.error(e));
  }, []);

  const postLineFoods = () => {
    dispatch({ type: lineFoodsActionsTypes.POSTING });
    postOrder({
      line_food_ids: state.lineFoodsSummary.line_food_ids,
    }).then(() => {
      dispatch({ type: lineFoodsActionsTypes.POST_SUCCESS });
    });
    console.log("ttt");
    window.location.reload();
  };

  const orderButtonLabel = () => {
    switch (state.postState) {
      case REQUEST_STATE.LOADING:
        return "注文中...";
      case REQUEST_STATE.OK:
        return "注文が完了しました！";
      default:
        return "注文を確定する";
    }
  };

  const isExistsLineFoodsSummary = () =>
    state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary;

  return (
    <Fragment>
      {/* Header */}
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo"></MainLogoImage>
        </Link>
      </HeaderWrapper>
      {/* orderlist */}
      <OrderListWrapper>
        <div>
          <OrderItemWrapper>
            {state.fetchState === REQUEST_STATE.LOADING ? (
              <CircularProgress />
            ) : (
              state.lineFoodsSummary && (
                <OrderDetailItem
                  restaurantFee={state.lineFoodsSummary.restaurant.fee}
                  restaurantName={state.lineFoodsSummary.restaurant.name}
                  restaurantId={state.lineFoodsSummary.restaurant.id}
                  timeRequired={state.lineFoodsSummary.restaurant.time_required}
                  foodCount={state.lineFoodsSummary.count}
                  price={state.lineFoodsSummary.amount}
                />
              )
            )}
          </OrderItemWrapper>
          <div>
            {isExistsLineFoodsSummary() && (
              <OrderButton
                onClick={() => postLineFoods()}
                disabled={
                  state.postState === REQUEST_STATE.LOADING ||
                  state.postState === REQUEST_STATE.OK
                }
              >
                {orderButtonLabel()}
              </OrderButton>
            )}
            {state.fetchState === REQUEST_STATE.OK &&
              !state.lineFoodsSummary && <p>注文予定の商品はありません。</p>}
          </div>
        </div>
      </OrderListWrapper>
    </Fragment>
  );
};
