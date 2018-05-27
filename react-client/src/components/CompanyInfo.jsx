import React from 'react';
import {
  Box, Card, CardHeader, CardHeaderTitle, CardHeaderIcon,
  CardImage, Image, CardContent, Media, MediaContent, MediaLeft, MediaRight,
  Title, Subtitle, Content, Icon,
} from 'bloomer';

const CompanyInfo = props => (
  <div>
    {/* <Box hasTextAlign='centered'>{JSON.stringify(props.item.name)}</Box> */}
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          {props.item.name}
        </CardHeaderTitle>
        <CardHeaderIcon>
          <Icon className="fa fa-angle-down" />
        </CardHeaderIcon>
      </CardHeader>
      <CardImage>
        <Image isRatio='4:3' src={props.item.profile_image} />
      </CardImage>
      <CardContent>
        <Media>
          <MediaContent>
            <Title isSize={2}>{props.item.name}</Title>
            <Subtitle isSize={6}>{props.item.homepage_url}</Subtitle>
            <Subtitle isSize={6}>{props.item.linkedin_url}</Subtitle>            
            <Box>{props.item.short_description}</Box>
          </MediaContent>
        </Media>
      </CardContent>
    </Card>

  </div>
);

export default CompanyInfo;
