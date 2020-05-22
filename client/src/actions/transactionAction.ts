import axios from 'axios';
import {Transaction} from "../types/Transaction";
import {Dispatch} from "redux";
import {
  TRANSACTION_FAIL,
  TRANSACTION_SUCCESS,
  TransactionActionTypes,
  TRANSACTIONS_RECEIVED
} from "./types/TransactionActionTypes";
import {Msg} from "../types/Msg";
import {tokenConfig} from "./authActions";
import {AppState} from "../store";
import {CreateTransaction} from "../types/CreateTransaction";

export const transactionSuccess = (): TransactionActionTypes => ({
  type: TRANSACTION_SUCCESS
});

export const transactionFail = (message: Msg, status: number): TransactionActionTypes => ({
  type: TRANSACTION_FAIL,
  payload: {message, status}
});

export const transactionsReceived = (transactions: Transaction[]): TransactionActionTypes => ({
  type: TRANSACTIONS_RECEIVED,
  transactions: transactions
});

export const newTransaction = (transaction: CreateTransaction) => (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
  axios
    .post('api/transaction/new', transaction, tokenConfig(getState))
    .then(res => {
        dispatch(transactionSuccess())
      }
    )
    .catch(err => {
      dispatch(transactionFail(err.data, err.status));
    });
};

export const getTransactions = () => (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
  axios.get('api/transaction/get', tokenConfig(getState))
    .then(res => {
      dispatch(transactionsReceived(res.data))
    })
    .catch(err => {
      dispatch(transactionFail(err, err));
    })
}