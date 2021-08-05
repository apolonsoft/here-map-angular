import {environment} from "../../../environments/environment";

declare var H: any;
import {Component, ElementRef, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {HereMapService} from "../../services/here-map/here-map.service";
import {Option} from "../../models/option";
import {HereMapLocality} from "../../models/here-map-locality";
import {Position} from "../../models/position";

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.scss']
})
export class HereMapComponent implements OnInit, AfterViewInit {
  private platform: any;
  private map: any;
  markers: Position[] = []
  options: Option[] = []
  searchResult: HereMapLocality[]= [];

  @ViewChild("map")
  public mapElement!: ElementRef;

  public constructor(
    private hereMapService: HereMapService
  ) {
    this.platform = new H.service.Platform({
      "apikey": environment.apiKeyJavascript
    });

  }

  public ngOnInit() {}

  public ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,{
        center: { lat: 41.850033, lng: -87.6500523 },
        zoom: 7,
        pixelRatio: window.devicePixelRatio || 1
      });
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    H.ui.UI.createDefault(this.map, defaultLayers);
  }

  search(query: string) {
    this.hereMapService.autoComplete(query).subscribe(resp => {
      this.searchResult = resp.items
      this.options = this.searchResult.map(item => new Option(item.id, item.title))
    })
  }

  optionSelected(option: Option) {
    const selectedItem = this.searchResult.find(item => item.id === option.key)
    this.options = []
    if (selectedItem)
      this.hereMapService.getCode(selectedItem.title).subscribe(resp => {
        const items = resp.items
        if (items.length > 0) {
          this.moveTo(items[0].position)
        }
      })
  }

  makeRoute() {
    this.markers.forEach((marker, index) => {
      if (this.markers[index + 1]) {
        const router = this.platform.getRoutingService(null, 8),
          routeRequestParams = {
            routingMode: 'fast',
            transportMode: 'car',
            origin: `${marker.lat},${marker.lng}`,
            destination: `${this.markers[index + 1].lat},${this.markers[index + 1].lng}`,
            return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
          };
        router.calculateRoute(
          routeRequestParams,
          this.onSuccess.bind(this)
        )
      }
    })
  }

  onSuccess(result: any) {
    const route = result.routes[0];
    route.sections.forEach((section: any) => {
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
      let polyline = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });
      this.map.addObject(polyline);
      this.map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });
    })
  }

  moveTo(position: Position) {
    this.map.setCenter(position)
    this.addMarker(position)
  }

  addMarker(position: Position) {
    const marker = new H.map.Marker(position)
    this.markers.push(position)
    this.map.addObject(marker)
  }
}
