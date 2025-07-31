import { Component } from "react";
import { View, StyleSheet } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { FontAwesome } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { Text } from "../Text";
import { Box } from "../Box";

const SECTIONS = [
  {
    title: "First",
    content: "Lorem ipsum...asd",
  },
];

interface Section {
  title: string;
  content: string;
}

export class AccordionView extends Component {
  state = {
    activeSections: [],
  };

  _renderSectionTitle = (section: Section) => (
    <View>
      <Text>{section.content}</Text>
    </View>
  );

  _renderHeader = (section: Section) => (
    <Box style={styles.accordionHeader}>
      <Text style={styles.headerText}>Filtro më shumë</Text>
      <FontAwesome name="chevron-down" size={12} color="#333" />
    </Box>
  );

  _renderContent = (section: Section) => (
    <View>
      <SelectDropdown
        searchInputStyle={styles.searchInputStyle}
        searchPlaceHolder="Kërko qytetin..."
        searchPlaceHolderColor="#6c757d"
        search={true}
        data={["City"]}
        onSelect={() => undefined}
        renderButton={(_, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>Zgjedh Qytetin</Text>
            <Text>
              <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
            </Text>
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View style={[styles.dropdownItemStyle, isSelected && styles.dropdownItemSelected]}>
            <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );

  _updateSections = (activeSections: number[]) => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        underlayColor="#transparent"
        onChange={this._updateSections}
      />
    );
  }
}

const styles = StyleSheet.create({
  accordionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#e4e4e4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontWeight: "500",
  },
  searchInputStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    marginBottom: 12,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemSelected: {
    backgroundColor: "#D2D9DF",
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
});
