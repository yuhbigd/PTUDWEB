import React from 'react'

const ThemeFunction = (theme) => {
    if(theme === 2) {
        document.documentElement.style.setProperty('--text-color-1', '#FEC260');
        document.documentElement.style.setProperty('--text-color-2', '#A12568');
        document.documentElement.style.setProperty('--main-theme', '#2A0944');
        document.documentElement.style.setProperty('--sub-theme-1', '#3B185F');
        document.documentElement.style.setProperty('--sub-theme-2', '#3B185F');
        document.documentElement.style.setProperty('--sub-theme-3', '#F43B86');
        document.documentElement.style.setProperty('--box-shadow-1', '0 0 4px 4px #F43B86');
        document.documentElement.style.setProperty('--disable-color', 'rgb(180, 180, 180)');
        document.documentElement.style.setProperty('--active-color', '#FEC260');
        document.documentElement.style.setProperty('--close-button', 'rgb(200, 200, 200)');
        document.documentElement.style.setProperty('--close-button-hover', 'white');
        document.documentElement.style.setProperty('--explorer-color', 'rgb(169, 169, 255)');
        document.documentElement.style.setProperty('--loading-1', 'rgb(169, 169, 255)');
        document.documentElement.style.setProperty('--loading-2', 'white');
        document.documentElement.style.setProperty('--loading-3', 'rgb(169, 169, 255)');
        document.documentElement.style.setProperty('--input-back', '#FAEDF0');
        document.documentElement.style.setProperty('--input-text', '#292C6D'); 
        document.documentElement.style.setProperty('--input-title', 'rgb(200, 200, 200)');    
        document.documentElement.style.setProperty('--span-error', '#FF5F7E');  
        document.documentElement.style.setProperty('--select-hover', '#F43B86');   
        document.documentElement.style.setProperty('--select-hover', '#F43B86');
    }else if(theme === 1) {
        document.documentElement.style.setProperty('--text-color-1', 'black');
        document.documentElement.style.setProperty('--text-color-2', 'rgb(90, 90, 90)');
        document.documentElement.style.setProperty('--main-theme', 'white');
        document.documentElement.style.setProperty('--sub-theme-1', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--sub-theme-2', 'rgb(240, 240, 240)');
        document.documentElement.style.setProperty('--sub-theme-3', 'rgb(240, 240, 240)');
        document.documentElement.style.setProperty('--box-shadow-1', '0 0 4px 4px rgb(100, 100, 100, 0.7)');
        document.documentElement.style.setProperty('--disable-color', 'rgb(180, 180, 180)');
        document.documentElement.style.setProperty('--active-color', 'black');
        document.documentElement.style.setProperty('--close-button', 'rgb(100, 100, 100)');
        document.documentElement.style.setProperty('--close-button-hover', 'black');
        document.documentElement.style.setProperty('--explorer-color', 'blue');
        document.documentElement.style.setProperty('--loading-1', '#383838');
        document.documentElement.style.setProperty('--loading-2', 'white');
        document.documentElement.style.setProperty('--loading-3', '#2b2b2b');
        document.documentElement.style.setProperty('--input-back', 'white');
        document.documentElement.style.setProperty('--input-text', '#292C6D');    
        document.documentElement.style.setProperty('--span-error', 'rgb(199, 3, 3)');  
        document.documentElement.style.setProperty('--select-hover', 'blue');   
    }else if(theme === 3) {
        document.documentElement.style.setProperty('--text-color-1', '#181D31');
        document.documentElement.style.setProperty('--text-color-2', 'rgb(90, 90, 90)');
        document.documentElement.style.setProperty('--main-theme', '#F0E9D2');
        document.documentElement.style.setProperty('--sub-theme-1', '#E6DDC4');
        document.documentElement.style.setProperty('--sub-theme-2', '#E6DDC4');
        document.documentElement.style.setProperty('--sub-theme-3', '#FF5151');
        document.documentElement.style.setProperty('--box-shadow-1', '0 0 4px 4px rgb(100, 100, 100, 0.7)');
        document.documentElement.style.setProperty('--disable-color', 'rgb(180, 180, 180)');
        document.documentElement.style.setProperty('--active-color', 'black');
        document.documentElement.style.setProperty('--close-button', 'rgb(100, 100, 100)');
        document.documentElement.style.setProperty('--close-button-hover', 'black');
        document.documentElement.style.setProperty('--explorer-color', 'blue');
        document.documentElement.style.setProperty('--loading-1', '#383838');
        document.documentElement.style.setProperty('--loading-2', 'white');
        document.documentElement.style.setProperty('--loading-3', '#2b2b2b');
        document.documentElement.style.setProperty('--input-back', 'white');
        document.documentElement.style.setProperty('--input-text', '#292C6D');    
        document.documentElement.style.setProperty('--span-error', 'rgb(199, 3, 3)');  
        document.documentElement.style.setProperty('--select-hover', 'blue');   
    }
}

export default ThemeFunction
