import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class SearchPipe {
    // country | search:'searchCriteria'
    transform(country, searchCriteria) {
        if (!searchCriteria || searchCriteria === '') {
            return true;
        }
        return `${country.name}+${country.dialCode}`
            .toLowerCase()
            .includes(searchCriteria.toLowerCase());
    }
}
SearchPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: SearchPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
SearchPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: SearchPipe, name: "search" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: SearchPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'search'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbWF0LWludGwtdGVsLWlucHV0L3NyYy9saWIvc2VhcmNoLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7O0FBT3BELE1BQU0sT0FBTyxVQUFVO0lBRXJCLG9DQUFvQztJQUNwQyxTQUFTLENBQUMsT0FBZ0IsRUFBRSxjQUF1QjtRQUNqRCxJQUFJLENBQUMsY0FBYyxJQUFJLGNBQWMsS0FBSyxFQUFFLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7YUFDekMsV0FBVyxFQUFFO2FBQ2IsUUFBUSxDQUNQLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FDN0IsQ0FBQztJQUNOLENBQUM7O3VHQWJVLFVBQVU7cUdBQVYsVUFBVTsyRkFBVixVQUFVO2tCQUh0QixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxRQUFRO2lCQUNmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb3VudHJ5IH0gZnJvbSAnLi9tb2RlbC9jb3VudHJ5Lm1vZGVsJztcblxuQFBpcGUoe1xuICBuYW1lOiAnc2VhcmNoJ1xufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgLy8gY291bnRyeSB8IHNlYXJjaDonc2VhcmNoQ3JpdGVyaWEnXG4gIHRyYW5zZm9ybShjb3VudHJ5OiBDb3VudHJ5LCBzZWFyY2hDcml0ZXJpYT86IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghc2VhcmNoQ3JpdGVyaWEgfHwgc2VhcmNoQ3JpdGVyaWEgPT09ICcnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7Y291bnRyeS5uYW1lfSske2NvdW50cnkuZGlhbENvZGV9YFxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5pbmNsdWRlcyhcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEudG9Mb3dlckNhc2UoKVxuICAgICAgKTtcbiAgfVxuXG59XG4iXX0=