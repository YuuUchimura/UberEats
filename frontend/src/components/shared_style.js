//lib
import styled from "styled-components";

//constants
import { COLORS } from "../style_constants";

// ボタンのもととなるコンポーネント
export const BaseButton = styled.button`
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
  :focus {
    outline: 0;
  }
`;

// 角丸なボタン
// BaseButtonを継承していることの注意
export const RoundButton = styled(BaseButton)`
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background-color: ${COLORS.SUB_BUTTON};
`;
