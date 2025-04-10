import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  Card,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const HoraireManagement = () => {
  const [horaires, setHoraires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHoraire, setEditingHoraire] = useState(null);

  useEffect(() => {
    fetchHoraires();
  }, []);

  const fetchHoraires = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://bhr-avocarbon.azurewebsites.net/horaires");
      setHoraires(response.data);
    } catch (error) {
      message.error("Erreur lors du chargement des horaires");
    }
    setLoading(false);
  };

  const handleAddOrEdit = async (values) => {
    try {
      const payload = {
        nom: values.nom,
        heure_debut: values.heure_debut.format("HH:mm"),
        heure_fin: values.heure_fin.format("HH:mm"),
        marque_retard: values.marque_retard || 0,
        marque_depart_anticipe: values.marque_depart_anticipe || 0,
        debut_entree: values.debut_entree.format("HH:mm"),
        fin_entree: values.fin_entree.format("HH:mm"),
        debut_sortie: values.debut_sortie.format("HH:mm"),
        fin_sortie: values.fin_sortie.format("HH:mm"),
        jours_travailles: values.jours_travailles || 0,
        minutes_travaillees: values.minutes_travaillees || 0,
      };

      if (editingHoraire) {
        await axios.put(
          `https://bhr-avocarbon.azurewebsites.net/horaires/${editingHoraire.id}`,
          payload
        );
        message.success("Horaire mis à jour avec succès");
      } else {
        await axios.post("https://bhr-avocarbon.azurewebsites.net/horaires", payload);
        message.success("Horaire ajouté avec succès");
      }

      fetchHoraires();
      setModalVisible(false);
      form.resetFields();
      setEditingHoraire(null);
    } catch (error) {
      message.error("Erreur lors de l'ajout/modification");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bhr-avocarbon.azurewebsites.net/horaires/${id}`);
      message.success("Horaire supprimé avec succès");
      fetchHoraires();
    } catch (error) {
      message.error("Erreur lors de la suppression");
    }
  };

  const openEditModal = (horaire) => {
    setEditingHoraire(horaire);
    setModalVisible(true);
    form.setFieldsValue({
      nom: horaire.nom,
      heure_debut: moment(horaire.heure_debut, "HH:mm"),
      heure_fin: moment(horaire.heure_fin, "HH:mm"),
      marque_retard: horaire.marque_retard,
      marque_depart_anticipe: horaire.marque_depart_anticipe,
      debut_entree: moment(horaire.debut_entree, "HH:mm"),
      fin_entree: moment(horaire.fin_entree, "HH:mm"),
      debut_sortie: moment(horaire.debut_sortie, "HH:mm"),
      fin_sortie: moment(horaire.fin_sortie, "HH:mm"),
      jours_travailles: horaire.jours_travailles,
      minutes_travaillees: horaire.minutes_travaillees,
    });
  };

  const columns = [
    { title: "Name", dataIndex: "nom", key: "nom" },
    { title: "Start", dataIndex: "heure_debut", key: "heure_debut" },
    { title: "End", dataIndex: "heure_fin", key: "heure_fin" },
    {
      title: "Entry Start",
      dataIndex: "debut_entree",
      key: "debut_entree",
    },
    {
      title: "Entry End",
      dataIndex: "fin_entree",
      key: "fin_entree",
    },
    {
      title: "Exit Start",
      dataIndex: "debut_sortie",
      key: "debut_sortie",
    },
    {
      title: "Exit End",
      dataIndex: "fin_sortie",
      key: "fin_sortie",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <div style={{ padding: 20 }}>
        <h2 className="text-2xl font-bold mb-4">Schedule Management</h2>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Add New Schedule
        </Button>
        <Table
          columns={columns}
          dataSource={horaires}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editingHoraire ? "Edit Schedule" : "Add Schedule"}
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingHoraire(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleAddOrEdit}>
            <Form.Item
              name="nom"
              label="Name"
              rules={[{ required: true, message: "Champ requis" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="heure_debut"
              label="Start Time"
              rules={[{ required: true }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="heure_fin"
              label="End Time"
              rules={[{ required: true }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="marque_retard" label="Late Mark">
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="marque_depart_anticipe"
              label="Early Departure Mark"
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="debut_entree" label="Entry Start">
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="fin_entree" label="Entry End">
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="debut_sortie" label="Exit Start">
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="fin_sortie" label="Exit End">
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Card>
  );
};

export default HoraireManagement;
