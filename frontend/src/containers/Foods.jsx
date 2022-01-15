// lib
import React, { Fragment, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";

// components
import { LocalMallIcon } from "../components/Icons";
import { FoodWrapper } from "../components/FoodWrapper";
import Skeleton from "@material-ui/lab/Skeleton";
import { FoodOrderDialog } from "../components/FoodOrderDialog";
import { NewOrderConfirmDialog } from "../components/NewOrderConfirmDialog";
import { postLineFoods, replaceLineFoods } from "../apis/line_foods";
import { HTTP_STATUS_CODE } from "../constants";

// reducers
import {
  initialState as foodsInitialState,
  foodsActionsTypes,
  foodsReducer,
} from "../reducers/foods";

// apis
import { fetchFoods } from "../apis/foods";

// Images
import MainLogo from "../images/logo.png";
import FoodImage from "../images/food-image.jpg";

// constants
import { COLORS } from "../style_constants";
import { REQUEST_STATE } from "../constants";

// styledcomppnents
import { HeaderWrapper, MainLogoImage } from "../components/StyledHeader";
const BagIconWrapper = styled.div`
  padding-top: 24px;
`;
const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

export const Foods = ({ match }) => {
  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingResutaurautName: "",
    newResutaurautName: "",
  };

  const [state, setState] = useState(initialState);
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
  const history = useHistory();

  useEffect(() => {
    dispatch({ type: foodsActionsTypes.FETCHING });
    fetchFoods(match.params.restaurantsId).then((data) => {
      dispatch({
        type: foodsActionsTypes.FETCH_SUCCESS,
        payload: {
          foods: data.foods,
        },
      });
    });
  }, []);

  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    })
      .then(() => history.push("/orders"))
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingRestaurantName: e.response.data.existing_restaurant,
            newRestaurantName: e.response.data.new_restaurant,
          });
        } else {
          throw e;
        }
      });
  };

  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push("/orders"));
  };

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {foodsState.fetchState === REQUEST_STATE.LOADING ? (
          <Fragment>
            {[...Array(12).keys()].map((i) => (
              <ItemWrapper key={i}>
                <Skeleton key={i} variant="rect" width={450} height={180} />
              </ItemWrapper>
            ))}
          </Fragment>
        ) : (
          foodsState.foodsList.map((food) => (
            <ItemWrapper key={food.id}>
              <FoodWrapper
                food={food}
                onClickFoodWrapper={(food) =>
                  setState({
                    ...state,
                    isOpenOrderDialog: true,
                    selectedFood: food,
                  })
                }
                imageUrl={FoodImage}
              />
            </ItemWrapper>
          ))
        )}
      </FoodsList>
      {state.isOpenOrderDialog && (
        <FoodOrderDialog
          food={state.selectedFood}
          isOpen={state.isOpenOrderDialog}
          countNumber={state.selectedFoodCount}
          onClickCountUp={() =>
            setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
            })
          }
          onClickCountDown={() =>
            setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
            })
          }
          onClickOrder={() => submitOrder()}
          onClose={() =>
            setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1,
            })
          }
        />
      )}
      {state.isOpenNewOrderDialog && (
        <NewOrderConfirmDialog
          isOpen={state.isOpenNewOrderDialog}
          onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
          existingRestaurantName={state.existingRestaurantName}
          newRestaurantName={state.newRestaurantName}
          onClickSubmit={() => replaceOrder()}
        />
      )}
    </Fragment>
  );
};
