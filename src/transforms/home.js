import HomeServices from '@/services/home';

export function getData(data, dataOptions) {
  const request = payload => ({});
  const response = payload => ({});

  return HomeServices.getData(request(data), dataOptions).then(response);
}
