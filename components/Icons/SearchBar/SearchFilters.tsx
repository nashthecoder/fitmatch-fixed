import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const filters = ["personnes", "publications", "évènements"];

const SearchFilters = ({ selectedFilter, setSelectedFilter }: any) => {
  return (
    <View className="mx-4 flex-row items-center justify-center pb-2 mt-4">
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={filter}
          className={`px-4 ${
            index !== filters.length - 1 ? "border-r border-r-white" : ""
          } `}
          onPress={() => setSelectedFilter(filter)}
          style={{
            borderBottomColor: selectedFilter === filter ? "red" : "white",
            borderBottomWidth: selectedFilter === filter ? 4 : 1,
            paddingBottom: 4,
          }}
        >
          <Text
            className={`font-roboto-condensed -tracking-[0.3px] text-[16px] text-white`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SearchFilters;
