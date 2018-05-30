import React from 'react';
import {
  Box, Card, CardHeader, CardHeaderTitle, CardHeaderIcon,
  CardImage, Image, CardContent, Media, MediaContent, MediaLeft, MediaRight,
  Title, Subtitle, Content, Icon, Level, LevelItem, Container,
} from 'bloomer';

const CompanyInfo = props => (
  <div>
    {/* <Box hasTextAlign='centered'>{JSON.stringify(props.item.name)}</Box> */}
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          {`${props.item.name} Info Card`}
        </CardHeaderTitle>
        <CardHeaderIcon>
          <Icon className="fa fa-angle-down" />
        </CardHeaderIcon>
      </CardHeader>
      <CardImage>
        <Level>
        <LevelItem><Container isFluid style={{ marginTop: 10 }}>
            <Image isSize='128x128' src={props.item.profile_image} />
        </Container></LevelItem>
        </Level>
      </CardImage>
      <CardContent>
        <Media>
          <MediaContent>
              <Title isSize={4}>{props.item.name}</Title>
              <Content>
                <p>{props.item.short_description}</p>
                <p>
                  <strong>Homepage:&#8195;</strong>
                  <a href={props.item.homepage_url}>{props.item.homepage_url || '(Not provided)'}</a>
                </p>
                <p>
                  <strong>LinkedIn:&#8195;</strong>
                  <a href={props.item.linkedin_url}>{props.item.linkedin_url || '(Not provided)'}</a>
                </p>
                <p>
                  <strong>CrunchBase:&#8195;</strong>
                  <a href={props.item.crunchbase_url}>{props.item.crunchbase_url || '(Not provided)'}</a>
                </p>
                <p>
                  <strong>Address:&#8195;</strong>
                  <a href={props.item.address}>{props.item.address || '(Unverified)'}</a>
                </p>
              </Content>
          </MediaContent>
        </Media>
      </CardContent>
    </Card>

  </div>
);

export default CompanyInfo;
