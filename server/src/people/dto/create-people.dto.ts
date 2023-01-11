export class CreatePeople {
  user: string;
  friend: [
    {
      email: string;
      name: string;
      phoneNumber: string;
      filename: string | undefined;
    },
  ];
}
