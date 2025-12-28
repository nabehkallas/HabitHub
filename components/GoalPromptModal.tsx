import { Button, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';

interface GoalPromptModalProps {
  visible: boolean;
  onSave: (amount: number) => void;
}

export default function GoalPromptModal({ visible, onSave }: GoalPromptModalProps) {
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (amount) {
      onSave(Number(amount));
      setAmount('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text h4 style={{ marginBottom: 20 }}>Set Monthly Goal</Text>
          <Text style={{ marginBottom: 15, textAlign: 'center' }}>
            It's a new month! What is your savings goal?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Amount (e.g. 500)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Button title="Set Goal" onPress={handleSave} containerStyle={{ width: '100%' }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '85%' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
});