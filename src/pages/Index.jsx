import React, { useState, useEffect } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Input, List, ListItem, Text, VStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const data = await client.getWithPrefix("customer:");
    if (data) {
      setCustomers(data.map(({ key, value }) => ({ id: key, ...value })));
    }
  };

  const handleAddOrUpdateCustomer = async () => {
    const key = selectedId ? selectedId : `customer:${Date.now()}`;
    const success = await client.set(key, { name, age: parseInt(age, 10) });
    if (success) {
      fetchCustomers();
      setName("");
      setAge("");
      setSelectedId(null);
      toast({
        title: selectedId ? "Customer updated" : "Customer added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCustomer = async (id) => {
    const success = await client.delete(id);
    if (success) {
      fetchCustomers();
      toast({
        title: "Customer deleted",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedId(customer.id);
    setName(customer.name);
    setAge(customer.age.toString());
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Age</FormLabel>
            <Input placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </FormControl>
          <Button mt={4} leftIcon={<FaPlus />} colorScheme="teal" onClick={handleAddOrUpdateCustomer}>
            {selectedId ? "Update Customer" : "Add Customer"}
          </Button>
        </Box>
        <List spacing={3}>
          {customers.map((customer) => (
            <ListItem key={customer.id} p={3} shadow="md" borderWidth="1px">
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">{customer.name}</Text>
                <Text>Age: {customer.age}</Text>
                <IconButton icon={<FaEdit />} onClick={() => handleEditCustomer(customer)} />
                <IconButton icon={<FaTrash />} onClick={() => handleDeleteCustomer(customer.id)} />
              </Flex>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
