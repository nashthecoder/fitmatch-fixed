import React from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BurgerButtonIcon from "../Icons/SearchBar/BurgerButtonIcon";
import SearchButtonIcon from "./SearchButtonIcon";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, loading }: any) => {
  return (
    <View className="mx-6 bg-white rounded-full flex-row py-2 px-2 items-center">
      <TouchableOpacity>
        <BurgerButtonIcon />
      </TouchableOpacity>
      <TextInput
        className="flex-1 ml-2"
        placeholder="Rechercher"
        value={searchTerm}
        onChangeText={setSearchTerm}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <TouchableOpacity onPress={onSearch}>
          <SearchButtonIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
