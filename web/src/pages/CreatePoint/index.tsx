import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FiCheckCircle } from "react-icons/fi";
import "./style.css";
import logo from "../../assets/logo.svg";
import { loadItems, loadUF, loadCity, savePoint } from "../../services/api";
import { LeafletMouseEvent } from "leaflet";
import { FormInput, FormSelect, ItemsGrid, Dropzone } from "../../components";
import { UF, City, Item } from "../../models/points.models";

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("0");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("0");
  const [visibleModal, setModalVisible] = useState<boolean>(false);
  const [selectedPosition, setPostion] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitialPostion] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    loadUF().then((response) => {
      const intials = response.data.map((uf: UF) => uf.sigla);
      setUfs(intials);
    });
    loadItems().then((response) => setItems(response.data));
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPostion([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    loadCity(selectedUf).then((response) => {
      const citiesNames = response.data.map((city: City) => city.nome);
      setCities(citiesNames);
    });
  }, [selectedUf]);

  const hasItemBeenSelected = (id: number) => {
    return selectedItems.includes(id);
  };

  const handleSelectedUfChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(event.target.value);
  };

  const handleSelectedCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleMapClick = (event: LeafletMouseEvent) => {
    setPostion([event.latlng.lat, event.latlng.lng]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemClick = (id: number) => {
    if (hasItemBeenSelected(id)) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const clearData = () => {
    setSelectedUf("0");
    setSelectedItems([]);
    setSelectedCity("0");
    setCities([]);
    setPostion([0, 0]);
    setFormData({
      name: "",
      email: "",
      whatsapp: "",
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    const sucess = await savePoint(data);
    if (sucess) {
      setModalVisible(true);
      clearData();
    }
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <Dropzone onImageUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <FormInput
            name="name"
            type="text"
            text="Nome da Entidade"
            value={formData.name}
            handleInputChange={handleInputChange}
          />

          <div className="field-group">
            <FormInput
              name="email"
              type="email"
              text="Email"
              value={formData.email}
              handleInputChange={handleInputChange}
            />
            <FormInput
              name="whatsapp"
              type="text"
              text="Whatsapp"
              value={formData.whatsapp}
              handleInputChange={handleInputChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <div className="field-group">
            <FormSelect
              name="uf"
              value={selectedUf}
              handleSelectedChange={handleSelectedUfChange}
              text="Selecione uma UF"
              data={ufs}
            />
            <FormSelect
              name="city"
              value={selectedCity}
              handleSelectedChange={handleSelectedCityChange}
              text="Selecione uma cidade"
              data={cities}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione o um ou mais itens abaixo</span>
          </legend>

          <ItemsGrid
            handleItemClick={handleItemClick}
            hasItemBeenSelected={hasItemBeenSelected}
            items={items}
          />
        </fieldset>

        <button type="submit" onClick={handleSubmit}>
          Cadastrar ponto de coleta
        </button>
      </form>

      <Modal
        open={visibleModal}
        onClose={() => setModalVisible(false)}
        closeOnOverlayClick
        center
        showCloseIcon={false}
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <FiCheckCircle size={53} color="#34CB79" />
        <h2 className="modalText">Cadastro concluído!</h2>
      </Modal>
    </div>
  );
};

export default CreatePoint;
