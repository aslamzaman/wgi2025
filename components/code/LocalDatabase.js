
const LocalDatabase = () => {
    const str = `const saveData = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving data to localStorage', error);
        }
    }
    
    
    const retrieveData = (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : [];
        } catch (error) {
            console.error('Error retrieving data from localStorage', error);
            return [];
        }
    }
    
    //----------------------------------------
    
    
    export const getItems = (key) => {
        return { data: retrieveData(key) };
    }
    
    
    export const addItem = (key, item) => {
        try {
            const data = retrieveData(key);
            const newData = data.length > 0 ? [...data, item] : [item];
            saveData(key, newData);
            return { message: "Data saved successfully." };
        } catch (error) {
            console.log(error);
            return { message: "Data saving error." };
        }
    }
    
    
    export const getOne = (key, itemId) => {
        try {
            const data = retrieveData(key);
            const item = data.find(t => parseInt(t.id) === parseInt(itemId));
            return { data: item || null };
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    
    
    export const updateItem = (key, itemId, updatedItem) => {
        try {
            const data = retrieveData(key);
            const indexOfItem = data.findIndex(t => parseInt(t.id) === parseInt(itemId));
            if (indexOfItem === -1) {
                return { message: "Data did not match." };
            }
            data[indexOfItem] = updatedItem;
            saveData(key, data);
            return { message: "Data updated successfully." };
        } catch (error) {
            console.log(error);
            return { message: "Updating error." };
        }
    }
    
    
    export const deleteItem = (key, itemId) => {
        try {
            const items = retrieveData(key);
            const updatedItems = items.filter(item => parseInt(item.id) !== parseInt(itemId));
    
            if (updatedItems.length === items.length) {
                return { message: 'Data does not match for deletion' };
            }
            saveData(key, updatedItems);
            return { message: 'Data deleted successfully.' };
        } catch (error) {
            console.error(error);
            return { message: 'Data deleting error.' };
        }
    };
    
    
  
    `;

    return str;
}

export default LocalDatabase;