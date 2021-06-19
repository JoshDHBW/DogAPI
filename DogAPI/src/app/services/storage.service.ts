import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Item{
  id: number,
  url: string,
  breed: string,
  datum: string,
}

const ITEMS_KEY = "my-items";
let aktuelles_item: Item;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }
  aktualisiereItem(item: Item){
    aktuelles_item = item
  }
  addItem(item: Item): Promise<any>{

    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(ITEMS_KEY, items);
      } else {
        return this.storage.set(ITEMS_KEY, [item]);
      }
    });
  }

  getItems():Promise <Item[]>{
    return this.storage.get(ITEMS_KEY);
  }
  updateItem(item: Item){
    return this.storage.get(ITEMS_KEY).then((items: Item[]) =>{
      if (!items || items.length === 0) {
        return null;
      }
      let newItems: Item[] = [];

      for (let i of items) {
        if (i.id === item.id) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, newItems);
    });
  }
  deleteItem(id: number): Promise<Item>{
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      let toKeep: Item[] = [];

      for (let i of items) {
        if (i.id !== id){
          toKeep.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, toKeep);
    });
  }
  deleteAllItems(): Promise<Item>{
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {

      return this.storage.remove(ITEMS_KEY);
    });
  }
  getAktuellesItem() {
    return aktuelles_item;
  }

}