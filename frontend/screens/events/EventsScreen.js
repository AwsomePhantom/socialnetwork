import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const sampleEvents = [
  { id: '1', title: 'Group Study Session', date: 'Dec 10', time: '2:00 PM', location: 'Main Library' },
{ id: '2', title: 'Holiday Notice', date: 'Dec 15', time: 'All Day', location: 'Local Park' },
];

const EventsScreen = () => {
  const renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.7}>
    <View style={styles.dateBadge}>
    <Text style={styles.dateText}>{item.date.split(' ')[1]}</Text>
    <Text style={styles.monthText}>{item.date.split(' ')[0]}</Text>
    </View>
    <View style={styles.eventInfo}>
    <Text style={styles.eventTitle}>{item.title}</Text>
    <Text style={styles.eventDetails}>{item.time} • {item.location}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.header}>Upcoming Events</Text>
    <FlatList
    data={sampleEvents}
    keyExtractor={(item) => item.id}
    renderItem={renderEvent}
    contentContainerStyle={styles.listPadding}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  listPadding: { padding: 16 },
  eventCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateBadge: {
    backgroundColor: '#eff6ff',
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateText: { fontSize: 20, fontWeight: '800', color: '#4f46e5' },
  monthText: { fontSize: 12, fontWeight: '600', color: '#4f46e5', textTransform: 'uppercase' },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  eventDetails: { fontSize: 14, color: '#64748b' },
});

export default EventsScreen;
