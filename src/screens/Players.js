import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../store/actions/user";
import { getDistance } from "geolib";
import { invitePlayer } from "../store/actions";
import { getAccessToken } from "../utility/token";
import { getBookingByPlayer } from "../store/actions/booking";
import {
  View,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { Alert } from "react-native";
import {
  Body,
  CardItem,
  Container,
  Content,
  Right,
  Text,
  Thumbnail,
  Card,
  Left,
  Button,
  Header,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { removeToken } from "../utility/token";

const Players = ({navigation}) => {
  const users = useSelector((state) => state.users);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user);
  const myBookingsRaw = useSelector((state) => state.myBooking);
  const [target, setTarget] = useState({});
  let myBookings = [...myBookingsRaw];
  myBookings = myBookings.filter((item) => item.status === "accepted");

  useEffect(() => {
    getAccessToken().then((res) => {
      dispatch(fetchUser(res));
      dispatch(getBookingByPlayer(userLogin._id, res));
    });
  }, [dispatch]);

  const openModal = (player) => {
    setTarget(player);
    setModalVisible(true);
  };
  const players = users.map((player) => {
    if (player.role === "player") {
      player.distance = getDistance(
        { latitude: userLogin.position.lat, longitude: userLogin.position.lng },
        { latitude: player.position.lat, longitude: player.position.lng }
      );
      return player;
    }
  });
  players.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  let listPlayers = [];
  players.forEach((player) => {
    if (player) {
      listPlayers.push(player);
    }
  });
  
  // listPlayers = listPlayers.slice(1);
  // console.log(listPlayers, "setelah slice");
  listPlayers = listPlayers.filter((player) => player._id != userLogin._id);

  console.log(listPlayers, "<<<< setelah filter");

  const logout = () => {
    removeToken();
    dispatch({
      type: "set-role",
      payload: "",
    });
    navigation.navigate("LoginPage");
  };

  return (
    <Container>
      <Header
        style={{
          flexDirection: "row",
          padding: 15,
          backgroundColor: "#EF7911",
        }}
      >
        <Text style={{ color: "white", fontSize: 20, marginLeft: "auto" }}>
          Nearby Players
        </Text>
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => logout()}
        >
          <Feather name="log-out" size={25} color="white" />
        </TouchableOpacity>
      </Header>
      <Content>
        {listPlayers.map((player) => {
          return (
            <React.Fragment>
              <Card key={player._id}>
                <CardItem style={{ margin: 10 }}>
                  <Left>
                    <Thumbnail
                      // square
                      // large
                      source={require("../assets/images/players.png")}
                    />
                    <Body>
                      <Text>{player.username}</Text>
                      <Text>{player.distance / 1000} KM</Text>
                    </Body>
                  </Left>
                  <Right>
                    <Button onPress={() => openModal(player)} transparent>
                      {/* <Icon active name="sign-in-alt" /> */}
                      <Text>Invite</Text>
                    </Button>
                  </Right>
                </CardItem>
              </Card>
            </React.Fragment>
          );
        })}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose your game!</Text>
              {myBookings.map((booking) => {
                return (
                  <View style={styles.modalView} key={booking._id}>
                    <Text>{booking.court.address}</Text>
                    <Button
                      style={{
                        ...styles.openButton,
                        backgroundColor: "green",
                      }}
                      onPress={() => dispatch(invitePlayer(target, booking))}
                    >
                      <Text>Invite</Text>
                    </Button>
                  </View>
                );
              })}

              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: "#2196F3",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Players;
