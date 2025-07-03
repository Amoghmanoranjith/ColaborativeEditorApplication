import { useAtom } from "jotai";
import { languageOptions } from "../constants/languageOptions";
import Select from "react-select";
import { languageAtom } from "../atoms";
import { useEffect } from "react";
import customStyles  from "../constants/customStyles";

const LanguageChanger = () =>{
    const [language, changeLanguage] = useAtom(languageAtom);
    useEffect(()=>{
        changeLanguage(language)
    },[])
    return <>
        <Select options = {languageOptions} onChange={(language)=>(changeLanguage(language))} value={language} styles={customStyles}></Select>
    </>
}

export default LanguageChanger