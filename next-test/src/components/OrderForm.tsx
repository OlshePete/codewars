"use client";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface UserData {
  name: string;
  email: string;
  phone: string;
}
interface RouteData {
    route_id:number;
    departure_id:number;
    date:string;
    count:number;
}
interface IFromData {
  user:UserData;
  route:RouteData;
}

const TEST_ROUTES = [
  {
    id: 0,
    name: "Route 1",
    departures: [
      {
        id: 1,
        value: 9,
      },
      {
        id: 2,
        value: 10,
      },
      {
        id: 3,
        value: 11,
      },
      {
        id: 4,
        value: 12,
      },
    ],
  },
  {
    id: 1,
    name: "Route 2",
    departures: [
      {
        id: 1,
        value: 9,
      },
      {
        id: 2,
        value: 10,
      },
      {
        id: 3,
        value: 11,
      },
      {
        id: 4,
        value: 12,
      },
    ],
  },
];
function OrderForm() {
  return (
    <div>
      <Formik
        initialValues={{
          user:{
            name: "",
          email: "",
          phone: "",
          },
          route: {
            route_id:0,
            departure_id:0,
            date:"",
            count:0,
          }
        }}
        onSubmit={(
          values: IFromData,
          { setSubmitting }: FormikHelpers<IFromData>
        ) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
      >
        {(props) => (
          <Form className="w-dvw grid grid-cols-2 border border-red-200 py-10">
            <div className="flex flex-col gap-2 border border-green-900">
      <h1>Signup</h1>
      <Field name="route.route_id" as="select">
   <option value="0">Red</option>
   <option value="1">Green</option>
   <option value="2">Blue</option>
 </Field>
            </div>
            <div className="flex flex-col gap-2 border border-green-900 p-20">
                <label htmlFor="user.name">Ваше имя</label>
                <Field id="user.name" name="user.name" placeholder="Иван" />

                <PhoneInput
                country={"ru"}
                value={props.values.user.phone}
                onChange={(phone) => props.setFieldValue("user.phone", phone)}
                isValid={(value, country: object, ...other) => {
                    console.log(country);
                    if (
                    !country ||
                    !("format" in country) ||
                    !("countryCode" in country)
                    ) {
                    return false; // or some other default value
                    }
                    const { countryCode, format } = country;
                    if (value.length === 0 || value === countryCode) return true;
                    if (
                    country &&
                    format &&
                    typeof format === "string" &&
                    format.length > 0
                    ) {
                    const validNumberCount: number | null =
                        countryCode === "7"
                        ? 11
                        : (format.match(/\./g)?.length as number | null);
                    // console.log('country',validNumberCount,'--',value.length, '//',countryCode,'//', format)

                    if (!validNumberCount || value.length !== validNumberCount) {
                        return "Номер не полный";
                    } else {
                        return true;
                    }
                    }
                    return true;
                }}
                />

                <label htmlFor="user.email">Почта (необязательно)</label>
                <Field
                id="user.email"
                name="user.email"
                placeholder="name@mail.ru"
                type="user.email"
                />

                <button type="submit">Оставить заявку</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default OrderForm;
