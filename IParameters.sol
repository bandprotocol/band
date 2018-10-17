pragma solidity ^0.4.24;


interface IParameters {

  function getUInt(string key) returns (uint256);
  function getString(string key) returns (string);

}
