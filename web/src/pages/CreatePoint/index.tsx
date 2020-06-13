import React, { useEffect, useState,ChangeEvent, FormEvent } from 'react';
import { Link,useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map,TileLayer,Marker } from 'react-leaflet'
import {LeafletMouseEvent} from 'leaflet'
import axios from 'axios'

import Dropzone from '../../components/Dropzone'

import api from '../../services/api'
import Logo from '../../assets/logo.png'
import './point.css'

interface item{
    id:number,
    title:string,
    image_url:string
}

interface ibgeUfResponse{
    sigla:string
}
interface ibgeCityResponse{
    nome:string
}
const CreatePoint: React.FC = () => {

    const[items,setItems]=useState<item[]>([])
    const[ufs,setUfs]=useState<string[]>([])
    const[citys,setCitys]=useState<string[]>([])
    
    const[formData,setFormData]=useState({
        name:'',
        email:'',
        whatsapp:'',
        funcionamento:''
    })


    const[selectedItems,setSelectedItems]=useState<number[]>([])
    const[selectedPosition,setSelectedPosition]=useState<[number, number]>([0,0])
    const[initialPosition,setInitialPosition]=useState<[number, number]>([0,0])
    const[selectedUf,setSelectedUf]=useState('0')
    const[selectedCity,setSelectedCity]=useState('0')
    
    const[selectedFile,setSelectedFile]=useState<File>()
    
    const[sanitize,setSanitize]=useState<string>('0')
    const[wifi,setWifi]=useState<string>('0')
    const[park,setPark]=useState<string>('0')
    

    function handleSelectSanitize(event:ChangeEvent<HTMLSelectElement>){
        const sanitize = event.target.value
        setSanitize(sanitize)
    }
    function handleSelectWifi(event:ChangeEvent<HTMLSelectElement>){
        const wifi = event.target.value
        setWifi(wifi)
    }
    function handleSelectPark(event:ChangeEvent<HTMLSelectElement>){
        const park = event.target.value
        setPark(park)
    }


    const history = useHistory()


    function handleSelectuf(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf)
    }
    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }
    function handleMapClick(event:LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        const {name,value}=event.target
        setFormData({ ...formData,[name]:value })
    }

    function handleSelectItem(id:number){
        const alreadySelected = selectedItems.findIndex(item=> item === id)
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems, id])
        }    
    }

    async function handleSubmit(event:FormEvent){
        event.preventDefault()

        const{ name,email,whatsapp}= formData
        const uf= selectedUf
        const city = selectedCity

        const[latitude,longitude]= selectedPosition
        const items = selectedItems
        
        const data = new FormData()

        data.append('name',name)
        data.append('email',email)
        data.append('whatsapp',whatsapp)
        data.append('uf',uf)
        data.append('city',city)
        data.append('latitude',String(latitude))
        data.append('longitude',String(longitude))
        data.append('items',items.join(','))
        
        if(selectedFile){
            data.append('image',selectedFile)
        }
        await api.post('points',data)

        alert('Estabelecimento cadastrado')
        
        history.push('/')
    }


    useEffect(()=>{
        api.get('items')
        .then(res =>{
            setItems(res.data)
        })

    },[])

    useEffect(()=>{
        axios.get<ibgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(res =>{
            const ufInitials = res.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })

    },[])

    useEffect(()=>{
        if(selectedUf === '0')
        return
         axios.get<ibgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(res =>{
            const cityNames = res.data.map( city => city.nome)
            setCitys(cityNames)
        })

    },[selectedUf])

    useEffect(()=>{
        navigator.geolocation
        .getCurrentPosition(pos=>{
            const {latitude,longitude}= pos.coords

            setInitialPosition([
                latitude,
                longitude
            ])
        })
    },[])


    return (
        <div id="page-create-point">
            <header>
                <img src={Logo} alt=""/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>
                    Estabelecimento
                </h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend><h2>Dados</h2></legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text" 
                                name="whatsapp" 
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>        
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="wifi">Wi-fi?</label>
                            <select name="wifi" id="wifi" value={wifi} onChange={handleSelectWifi}>
                                <option value="0">Selecione uma opção</option>
                                <option value="sim">Sim</option>
                                <option value="nao">Não</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="park">Estacionamento gratuito?</label>
                            <select name="park" id="park" value={park} onChange={handleSelectPark}>
                                <option value="0">Selecione uma opção</option>
                                <option value="sim">Sim</option>
                                <option value="nao">Não</option>
                            </select>
                        </div>        
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="sanitize">Banheiros?</label>
                            <select name="sanitize" id="sanitize" value={sanitize} onChange={handleSelectSanitize}>
                                <option value="0">Selecione uma opção</option>
                                <option value="sim">Sim</option>
                                <option value="nao">Não</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="funcionamento">Horario de funcionamento?</label>
                            <input 
                                type="text" 
                                name="funcionamento" 
                                id="funcionamento"
                                onChange={handleInputChange}
                            />
                        </div>        
                    </div>
                    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>




                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectuf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map((uf)=>{
                                    return(
                                        <option key={uf} value={uf}>{uf}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" value={selectedCity} id="city"  onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {citys.map((city)=>{
                                    return(
                                        <option key={city} value={city}>{city}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Tipos de estabelecimento</h2>
                        <span>Selecione um ou mais tipos abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map((item)=>{
                            return (
                                <li 
                                    key={item.id} 
                                    onClick={()=>handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id)?'selected':''}
                                >
                                    <img src={item.image_url} alt=""/>
                                    <span>{item.title}</span>
                                </li>
                            )
                        })}
                        
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar Estabelecimento
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;