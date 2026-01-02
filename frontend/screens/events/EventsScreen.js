import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const sampleEvents = [
  { id: '1', title: 'Group Study Session', date: 'Dec 10', location: 'Main Library' },
  { id: '2', title: 'Holiday Notice', date: 'Dec 15', location: 'Local Park' },
];

const EventsScreen = () => {
  const renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>{item.date} @ {item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Add a button/segment control for filtering here */}
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={sampleEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventsScreen;