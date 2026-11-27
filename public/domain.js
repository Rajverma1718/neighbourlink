export const AMENITIES=['Wi-Fi','Parking','Lift','Power backup','Water supply','Kitchen','Balcony','Pet friendly'];
export const FACILITIES=['Wheelchair accessible','Women facilities','Baby changing','Drinking water','Gender neutral'];
export const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function coordinates(lat,lng){lat=Number(lat);lng=Number(lng);if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat<-90||lat>90||lng<-180||lng>180)throw new Error('Choose a valid location on the map.');return {lat,lng}}
export function distanceKm(a,b){if(!a||!b)return null;const rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),v=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(v),Math.sqrt(Math.max(0,1-v)))}
const text=(v,name,min,max)=>{const s=String(v??'').trim();if(s.length<min||s.length>max)throw new Error(name+' must contain '+min+' to '+max+' characters.');return s};
const money=(v,name)=>{const n=Number(v);if(v===''||!Number.isFinite(n)||n<0||n>100000000)throw new Error('Enter a valid '+name+'.');return Math.round(n*100)/100};
export function validateListing(input){
 const kind=input.kind;if(!['restroom','rental'].includes(kind))throw new Error('Choose restroom or rental.');
 const location=coordinates(input.lat,input.lng);
 if(!Array.isArray(input.features||[])||!Array.isArray(input.photos||[]))throw new Error('Use valid facility and photo lists.');
 const result={kind,title:text(input.title,'Title',4,100),description:text(input.description,'Description',15,2000),locality:text(input.locality,'Locality',2,150),...location,features:(input.features||[]).filter(x=>(kind==='rental'?AMENITIES:FACILITIES).includes(x)),photos:input.photos||[],status:input.status==='inactive'?'inactive':'active'};
 if(!Array.isArray(input.features||[])||!Array.isArray(result.photos)||result.photos.length>5)throw new Error('Use up to five photos.');
 if(kind==='rental'){
  result.rent=money(input.rent,'monthly rent');if(result.rent<=0)throw new Error('Monthly rent must be greater than zero.');result.deposit=money(input.deposit,'deposit');result.area_sqft=Number(input.area_sqft);if(!Number.isFinite(result.area_sqft)||result.area_sqft<=0||result.area_sqft>1000000)throw new Error('Enter a valid area in square feet.');
  if(!['Room','1 RK','1 BHK','2 BHK','3 BHK','House'].includes(input.property_type))throw new Error('Choose the property type.');result.property_type=input.property_type;
  if(!['Unfurnished','Semi-furnished','Furnished'].includes(input.furnishing))throw new Error('Choose the furnishing.');result.furnishing=input.furnishing;
  result.available_from=text(input.available_from,'Available-from date',10,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(result.available_from)||Number.isNaN(Date.parse(result.available_from))||new Date(result.available_from).toISOString().slice(0,10)!==result.available_from)throw new Error('Choose a valid available-from date.');
  result.lat=Math.round(result.lat*1000)/1000;result.lng=Math.round(result.lng*1000)/1000;
 }else{result.fee=input.fee===''||input.fee==null?null:money(input.fee,'entry fee');result.hours=text(input.hours||'Not provided','Opening hours',2,160);result.access=text(input.access||'Public','Access details',2,160)}
 return result;
}
export function listingMatches(item,filter,origin){
 if(item.kind!==filter.kind||item.status!=='active')return false;
 const search=String(filter.query||'').toLowerCase();if(search&&!((item.title+' '+item.locality).toLowerCase().includes(search)))return false;
 if(filter.kind==='rental'){
  if(filter.maxRent&&Number(item.rent)>Number(filter.maxRent))return false;
  if(filter.propertyType&&item.property_type!==filter.propertyType)return false;
  if(filter.furnishing&&item.furnishing!==filter.furnishing)return false;
 }else{
  if(filter.freeOnly&&item.fee!==0)return false;
  if(filter.accessible&&!item.features?.includes('Wheelchair accessible'))return false;
  if(filter.twentyFour&&item.hours!=='24/7')return false;
 }
 if(filter.radius&&origin){const d=distanceKm(origin,item);if(d>Number(filter.radius))return false}
 return true;
}
export function sortListings(items,sort,origin){return [...items].sort((a,b)=>sort==='price'?Number(a.rent??a.fee??Infinity)-Number(b.rent??b.fee??Infinity):sort==='space'?Number(b.area_sqft||0)-Number(a.area_sqft||0):sort==='distance'&&origin?distanceKm(origin,a)-distanceKm(origin,b):new Date(b.created_at||0)-new Date(a.created_at||0))}
export function osmRestrooms(elements){return elements.filter(e=>e.tags?.amenity==='toilets').map(e=>{const t=e.tags,p=e.center||e;return {id:'osm-'+e.type+'-'+e.id,kind:'restroom',title:t.name||'Public restroom',locality:[t['addr:suburb'],t['addr:street'],t['addr:city']].filter(Boolean).join(', ')||'OpenStreetMap location',description:t.description||'Community-mapped restroom. Check the location and opening information before visiting.',lat:p.lat,lng:p.lon,fee:t.fee==='no'?0:null,hours:t.opening_hours||'Not provided',access:t.access||'Not provided',features:[...(t.wheelchair==='yes'?['Wheelchair accessible']:[]),...(t.female==='yes'?['Women facilities']:[]),...(t.changing_table==='yes'?['Baby changing']:[])],photos:[],status:'active',source:'OpenStreetMap',source_url:'https://www.openstreetmap.org/'+e.type+'/'+e.id,created_at:null}}).filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lng))}
