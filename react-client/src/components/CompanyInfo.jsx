import React from 'react';
import {
  Box, Card, CardHeader, CardHeaderTitle, CardHeaderIcon,
  CardImage, Image, CardContent, Media, MediaContent, MediaLeft, MediaRight,
  Title, Subtitle, Content, Icon, Level, LevelItem,
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
        <Level>
          <LevelItem>
            <Image isSize='128x128' src={props.item.profile_image} />
          </LevelItem>
        </Level>
      </CardImage>
      <CardContent>
        <Media>
          <MediaContent>
            <Title isSize={2}>{props.item.name}</Title>
            <Box>
              <Content>
                <p>{props.item.short_description}</p>
                <a href={props.item.homepage_url}>{props.item.homepage_url}</a><br />
                <a href={props.item.linkedin_url}>{props.item.linkedin_url}</a>
              </Content>
            </Box>
          </MediaContent>
        </Media>
      </CardContent>
    </Card>

  </div>
);

export default CompanyInfo;
