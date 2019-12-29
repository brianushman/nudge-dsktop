import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'getValues'})
export class MapPipeValues implements PipeTransform {
    transform(map: Map<any, any>): any[] {
        let ret = [];

        map.forEach((val, key) => {
            ret.push({
                key: key,
                val: val
            });
        });

        return ret;
    }
}